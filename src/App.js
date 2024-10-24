import './App.css';

import { Component } from 'react';
import { Tabs, Spin, Alert, Input, Pagination } from 'antd';
import { debounce } from 'lodash';

import List from './List.js';
import { moviesApi } from './Api.js';
import { genres } from './genres.js';
import { Provider } from './context.js';

export default class App extends Component {
  state = {
    tab: 'search',
    movie: '',
    movies: null,
    page: null,
    loading: false,
    err: false,
    totalResults: 0,
    rated: null,
    totalResultsRate: 0,
    pageRate: 1,
    count: 0,
  };

  _getList = (movie, page) => {
    if (movie === '') {
      this.setState({ movies: null, page: null, loading: false, err: false, totalResults: 0 });
      return;
    }
    this.setState({ loading: true });
    moviesApi.getMovies(movie, page).then((result) => {
      if (!result) {
        this.setState({ err: true });
      } else {
        this.setState({
          page: result.page,
          movies: result.results,
          loading: false,
          err: false,
          totalResults: result.total_results,
        });
      }
    });
  };

  getList = debounce(this._getList, 600);

  getRate = (page) => {
    if (this.state.count === 0) return;
    // this.setState({ loading: true });
    moviesApi.getRatedMovies(page).then((result) => {
      if (!result) {
        this.setState({ err: true });
      } else {
        this.setState({
          pageRate: result.page,
          rated: result.results,
          loading: false,
          err: false,
          totalResultsRate: result.total_results,
        });
      }
    });
  };

  onAddRate = (movie, rate) => {
    moviesApi.addRate(movie, rate).then((result) => {
      this.setState({ err: !result });
      this.getRate(this.state.pageRate);
      this.setState({ count: 1 });
    });
  };

  onText = (e) => {
    this.setState({ movie: e.target.value });
    this.getList(e.target.value, 1);
  };

  onTabs = (key) => {
    if (key === 'Search') {
      this.setState({ tab: 'search', pageRate: 1 });
      this._getList(this.state.movie, this.state.page);
    } else if (key === 'Rated') {
      this.setState({ tab: 'rated' });
      this.getRate(this.state.pageRate);
    }
  };

  onPagination = (page) => {
    this.getList(this.state.movie, page);
  };

  onPaginationRate = (page) => {
    this.getRate(page);
  };

  render() {
    if (moviesApi.guestId === false) return <Alert type="error" message="Something is bad :(" className="alert" />;
    const { movie, movies, rated, loading, err, page, totalResults, tab, totalResultsRate, pageRate } = this.state;
    let content = null;
    if (err) {
      content = <Alert type="error" message="We have a problem" className="alert" />;
    } else if (loading) {
      content = <Spin className="app__spin" size="large" />;
    } else if (tab === 'search') {
      content = (
        <>
          <List movies={movies} onAddRate={this.onAddRate} rated={rated} />
          {totalResults ? (
            <div className="wrapper">
              <Pagination
                onChange={this.onPagination}
                total={totalResults}
                pageSize="20"
                current={page}
                showSizeChanger={false}
                className="app__pagination"
              />
            </div>
          ) : null}
        </>
      );
    } else if (tab === 'rated') {
      content = (
        <>
          <List movies={rated} onAddRate={this.onAddRate} rated={rated} />
          {totalResultsRate ? (
            <div className="wrapper">
              <Pagination
                onChange={this.onPaginationRate}
                total={totalResultsRate}
                pageSize="20"
                current={pageRate}
                showSizeChanger={false}
                className="app__pagination"
              />
            </div>
          ) : null}
        </>
      );
    }
    return (
      <main className="main">
        <Provider value={genres}>
          <Tabs
            centered
            destroyInactiveTabPane={true}
            onChange={this.onTabs}
            items={[
              {
                label: 'Search',
                key: 'Search',
                children: (
                  <>
                    <Input
                      type="text"
                      placeholder="Type to search..."
                      className="app__input"
                      autoFocus
                      onChange={this.onText}
                      value={movie}
                    />
                    {content}
                  </>
                ),
              },
              {
                label: 'Rated',
                key: 'Rated',
                children: content,
              },
            ]}
          />
        </Provider>
      </main>
    );
  }
}
