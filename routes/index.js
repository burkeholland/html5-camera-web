
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { path: "/stylesheets/", title: 'HTML5 Camera' })
};

/* Begin Authentication Routes */

var OAuth = require('oauth').OAuth;

var oa = new OAuth(
	"https://api.twitter.com/oauth/request_token",
	"https://api.twitter.com/oauth/access_token",
	"dq5SoaEEcUztF8H7d6jAw",
	"uYxGrLPchCNeH5Ph5RRUK2LEmenfSRVZ5jmvV2spwJc",
	"1.0",
	"http://localhost.com:3000/authenticate/twitter/callback",
	"HMAC-SHA1"
);

exports.twitterCallback = function(req, res) {
    
    console.log(req.session);

    if (req.session.hasOwnProperty('callmade')) {
        
        console.log("call was made");
        
		oa.getOAuthAccessToken(req.session.oAuthVars.oauth_token, req.session.oAuthVars.oauth_token_secret, req.param('oauth_verifier'),
		    function(error, oauth_access_token,oauth_access_token_secret, tweetRes) {
		
    		    if (error) {
        			console.log('getOAuthAccessToken error: ', error);
        			//do something here UI wise
        			return;
        		}
		
        		req.session.oAuthVars.oauth_access_token = oauth_access_token;
        		req.session.oAuthVars.oauth_access_token_secret = oauth_access_token_secret;
        		req.session.oAuthVars.oauth_verifier = req.param('oauth_verifier');
		
        		var obj = {};
        		obj.user_id = tweetRes.user_id;
        		obj.screen_name = tweetRes.screen_name;
        		obj.oauth_access_token = oauth_access_token;
        		obj.oauth_access_token_secret = oauth_access_token_secret;
        		obj.profile_image_url = tweetRes.profile_image_url;
		
        		//Here we add the 'obj' contain the details to a DB and user this to get the users access details.
        		res.render('twitter', { success: true });
        		console.log(obj);
	        }
	    );
	
	}
	
	else {
	
		res.render('twitter', { success: false });
	
	}
    
};

exports.twitter = function(req, res){
    	function getOAuthRequestTokenFunc(error, oauth_token, oauth_token_secret, results) {
    		if (error) return console.log('getOAuthRequestToken Error', error);
    		req.session.callmade = true;
    		req.session.oAuthVars = {};
    		req.session.oAuthVars.oauth_token = oauth_token;
    		req.session.oAuthVars.oauth_token_secret = oauth_token_secret;
    		
    		console.log(req.session);
    		
    		res.redirect('https://api.twitter.com/oauth/authorize?oauth_token=' + oauth_token);
    	}
    	//We could store all this in a DB but for another time
    	oa.getOAuthRequestToken(getOAuthRequestTokenFunc);
};


