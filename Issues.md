serverless create --template aws-nodejs-typescript --path serverless-swapi
serverless offline start
serverless deploy
npx serverless invoke local -f swapiPost --path data.json
npx serverless config credentials --provider aws --key AKIAQWCWK3VXGD36THQY  --secret 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 --profile custom-profile
npx jest --config jest.config.ts