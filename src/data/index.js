const { obtainOverride } = require("./manualMockDataProvider");

//Determine if we are using real data sources or MockData
const actuals = require("./actualHttpCalls");
const mocks = require("./mockHttpCalls");

//As this is just a portfolio site, we will be using mock data in all cases.
//If we were note, determine mockData state based on environment state E.G Dev vrs Prod vrs if
// API endpoint exists etc
const determineIfUsingMocksMocks = true;

const locateFunction = (fnName) => {
  const override = obtainOverride(fnName);
  if (override) {
    return override;
  } else {
    return determineIfUsingMocksMocks(fnName) ? mocks[fnName] : actuals[fnName];
  }
};

module.exports = new Proxy(
  {},
  {
    get: function (target, prop) {
      const fn = locateFunction(prop);
      if (!fn) {
        //This could be set to return to a log file instead of a general console log error depending
        //on requirements.

        console.error(`Data getter does not exist: ${prop}.`);
        console.error(`UsingMocks state: ${determineIfUsingMocksMocks}`);
        //if nothingi s found resolve to a empty object.
        return () => new Promise((resolve) => resolve({}));
      }
      return fn;
    },
  }
);
