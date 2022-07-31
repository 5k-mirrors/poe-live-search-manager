// https://stackoverflow.com/questions/46898185/electron-jest-ipcrenderer-is-undefined-in-unit-tests
export const ipcRenderer = {
  send: jest.fn(),
  sendSync: jest.fn().mockImplementation(() => []),
  on: jest.fn(),
};

export const BrowserWindow = {
  getAllWindows: jest.fn().mockImplementation(() => []),
};
