#!/bin/bash
zip tempora.zip -r index.js src/ node_modules/
aws lambda update-function-code --function-name tempora-auth --zip-file fileb://tempora.zip
aws lambda update-function-code --function-name tempora-api-authorizer --zip-file fileb://tempora.zip
