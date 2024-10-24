export default class Api {
  apiKey = '9b450427346eafc4f1c582c23e0da68f';

  async startGuest() {
    try {
      const res = await fetch(`https://api.themoviedb.org/3/authentication/guest_session/new?api_key=${this.apiKey}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
      });
      if (!res.ok) this.id = false;
      const ans = await res.json();
      if (!ans.success) this.id = false;
      this.id = ans.guest_session_id;
    } catch {
      this.id = false;
    }
  }

  async getMovies(movie, page) {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/search/movie?query=${movie}&page=${page}&api_key=${this.apiKey}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json;charset=utf-8',
          },
        }
      );
      if (!res.ok) return false;
      return await res.json();
    } catch {
      return false;
    }
  }

  async getRatedMovies(page) {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/guest_session/${this.id}/rated/movies?page=${page}&api_key=${this.apiKey}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json;charset=utf-8',
          },
        }
      );
      if (!res.ok) return false;
      return await res.json();
    } catch {
      return false;
    }
  }

  async addRate(movie, rate) {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/${movie}/rating?guest_session_id=${this.id}&api_key=${this.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json;charset=utf-8',
          },
          body: `{ "value": ${rate} }`,
        }
      );
      return res.ok;
    } catch {
      return false;
    }
  }
}

const moviesApi = new Api();
moviesApi.startGuest();

export { moviesApi };
