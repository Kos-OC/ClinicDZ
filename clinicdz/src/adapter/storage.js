const PREFIX = 'clinicdz_';

export const storage = {
  saveData: (state) => {
    localStorage.setItem(PREFIX + 'state', JSON.stringify(state));
  },
  loadData: () => {
    const data = localStorage.getItem(PREFIX + 'state');
    return data ? JSON.parse(data) : null;
  },
  clearData: () => {
    localStorage.removeItem(PREFIX + 'state');
  }
};
