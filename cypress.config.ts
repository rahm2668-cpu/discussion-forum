import { defineConfig } from "cypress";
import webpackPreprocessor from "@cypress/webpack-preprocessor";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    setupNodeEvents(on, config) {
      const options = {
        webpackOptions: {
          resolve: {
            extensions: [".ts", ".js", ".tsx", ".jsx"],
          },
          module: {
            rules: [
              {
                test: /\.tsx?$/,
                exclude: [/node_modules/],
                use: [
                  {
                    loader: "ts-loader",
                  },
                ],
              },
            ],
          },
        },
      };
      on("file:preprocessor", webpackPreprocessor(options));
      return config;
    },
    specPattern: "cypress/e2e/**/*.cy.{js,ts}",
    video: false,
  },
});
