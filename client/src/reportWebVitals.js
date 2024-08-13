// This function is used to measure the performance of the app
// and report key metrics such as CLS, FID, FCP, LCP, and TTFB.

const reportWebVitals = (callback) => {
  if (callback && typeof callback === 'function') {
    import('web-vitals')
      .then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
        // Measure and report the performance metrics
        getCLS(callback);
        getFID(callback);
        getFCP(callback);
        getLCP(callback);
        getTTFB(callback);
      })
      .catch((error) => {
        console.error('Failed to load web-vitals:', error);
      });
  }
};

export default reportWebVitals;
