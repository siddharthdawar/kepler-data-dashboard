const API_URL = 'http://localhost:8000';

const httpGetPlanets = async () => {
  const response = await fetch(`${API_URL}/planets`);

  return await response.json();
};

const httpGetLaunches = async () => {
  const response = await fetch(`${API_URL}/launches`);
  const launches = await response.json();

  return launches.sort((a, b) => a.flightNumber - b.flightNumber);
};

const httpSubmitLaunch = async (launch) => {
  try {
    return await fetch(`${API_URL}/launches`, {
      body: JSON.stringify(launch),
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST'
    });
  } catch (error) {
    return {
      ok: false
    };
  }
};

const httpAbortLaunch = async (flightNumber) => {
  try {
    return await fetch(`${API_URL}/launches/${flightNumber}`, {
      method: 'PUT'
    });
  } catch (error) {
    return {
      ok: false
    };
  }
};

export {
  httpGetPlanets,
  httpGetLaunches,
  httpSubmitLaunch,
  httpAbortLaunch,
};
