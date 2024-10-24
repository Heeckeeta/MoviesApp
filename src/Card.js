import './Card.css';

import { parseISO, format } from 'date-fns';
import { Component } from 'react';
import { Rate } from 'antd';

import placeholder from './card__placeholder.png';
import { Consumer } from './context.js';

let keys = 100;

export default class Card extends Component {
  shortText = (text) => {
    const idx = text.indexOf(' ', 80);
    if (idx === -1 || text.length < 80) return text;
    return text.slice(0, idx) + ' ...';
  };

  color = (val) => {
    if (val <= 3) return 'card__rate1';
    if (val <= 5) return 'card__rate2';
    if (val <= 7) return 'card__rate3';
    return 'card__rate4';
  };

  genresArr = (genres, genresIds) => {
    return genresIds
      .map((genre) => {
        const idx = genres.findIndex((el) => el.id === genre);
        return (
          <p className="card__jenre" key={keys++}>
            {genres[idx].name}
          </p>
        );
      })
      .slice(0, 3);
  };

  checkRate = (id) => {
    let ans = 0;
    if (Array.isArray(this.props.rated)) {
      this.props.rated.forEach((el) => {
        if (el.id === id) ans = el.rating;
      });
    }
    return ans;
  };

  render() {
    const { movie, onAddRate } = this.props;
    const rateStyle = this.color(movie.vote_average) + ' card__rate';
    const src = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : placeholder;
    return (
      <Consumer>
        {(genres) => {
          return (
            <div className="card">
              <div className="card__img">
                <img src={src} alt="" className="img" />
              </div>
              <p className="card__title">{movie.original_title}</p>
              <div className={rateStyle}>{movie.vote_average.toFixed(1)}</div>
              <p className="card__date">
                {movie.release_date && format(new Date(parseISO(movie.release_date)), 'MMMM dd, yyyy')}
              </p>
              <div className="card__jenres">{this.genresArr(genres, movie.genre_ids)}</div>
              <p className="card__text">{this.shortText(movie.overview)}</p>
              <Rate
                className="card__pagination"
                allowHalf
                count={10}
                onChange={(rate) => onAddRate(rate)}
                defaultValue={this.checkRate(movie.id)}
              />
            </div>
          );
        }}
      </Consumer>
    );
  }
}
