import './List.css';

import { Alert } from 'antd';

import Card from './Card.js';

export default function List({ movies, onAddRate, rated }) {
  if (Array.isArray(movies) && movies.length === 0) {
    return <Alert type="info" className="alert" message="We don't know the movie" />;
  }
  if (movies !== null) {
    return (
      <div className="movies">
        {movies.map((movie) => (
          <Card rated={rated} movie={movie} key={movie.id} onAddRate={(rate) => onAddRate(movie.id, rate)} />
        ))}
      </div>
    );
  }
}
