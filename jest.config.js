module.exports = {
    "roots": [
      "<rootDir>/__tests__/"
    ],
    testMatch: [
      "**/test/**/*.+(ts|tsx|js)",
      "**/?(*.)+(spec|test).+(ts|tsx|js)"
    ],
    "transform": {
      "^.+\\.(ts|tsx)$": "ts-jest"
    },
    globals: {
      'ts-jest': {
        diagnostics: false
      }
    },
    testEnvironment: "node"
  }