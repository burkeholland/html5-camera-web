node-oauth
=

An adaptor for OAuth 1.0 and OAuth 2.0 API.

Install
-

    npm install node-oauth


Usage
-

require `node-oauth`

```js
var OAuth = require('node-oauth');

```

set your application OAuth setting file.

```js
OAuth = OAuth("sample/object-oauth.js")

```

jump to Login page
response is necessary for redirect.

```js
OAuth.authorize('facebook',{
    response: res,
    endCallback: function(err) {
      if(err)
        onError(err);
    }
  });

```

(OAuth 1.0)
if you don't want to go authorize, you can control after getting request token.
Authorizer object returns. It have setting datas on its fields.

```js
var oauthAuthorizer = OAuth.authorize('twitter', {
    auto: false
  });

```

get access token in redirect page
Tokener object returns.

```js
var oauthTokener = OAuth.access(oauth['type'], {
        href: location.href
      }, authorized);

```

if you want to set access_token externaly, ( that is , not via url )

````
oauthTokener.set({
  request_token: oauth['req_tkn'],
  access_token: oauth['oac_tkn'],
  access_token_secret: oauth['oac_tkn_scr']
});

````

access to api with name (set in setting file) / url.

```js
oauthTokener.get("credentials", {}, getId);

```
