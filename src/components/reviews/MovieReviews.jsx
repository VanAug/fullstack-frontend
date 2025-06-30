import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchMovieDetails, fetchMovieReviews } from '../../api/api';
import './MovieReviews.css';

const MovieReviews = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch movie details
        const movieData = await fetchMovieDetails(id);
        setMovie(movieData);
        
        // Fetch reviews from our backend
        const reviewsData = await fetchMovieReviews(id);
        setReviews(reviewsData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load reviews. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="reviews-loading">
        <div className="spinner"></div>
        <p>Loading reviews...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="reviews-error">
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="retry-btn">
          Retry
        </button>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="reviews-error">
        <p>Movie not found</p>
        <button onClick={() => navigate('/')} className="back-btn">
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="reviews-container">
      <div className="reviews-header">
        <h1>Reviews for {movie.title}</h1>
        <button onClick={() => navigate(`/movie/${id}`)} className="back-btn">
          Back to Movie
        </button>
      </div>

      {reviews.length === 0 ? (
        <div className="no-reviews">
          <p>No reviews yet. Be the first to review!</p>
          <button 
            onClick={() => navigate(`/movie/${id}`)} 
            className="rate-btn"
          >
            Rate this Movie
          </button>
        </div>
      ) : (
        <div className="reviews-list">
          {reviews.map((review) => (
            <div key={review.id} className="review-card">
              <div className="review-header">
                <div className="review-username">{review.username || 'Anonymous'}</div>
                <div className="review-rating">⭐ {review.score}/10</div>
              </div>
              <div className="review-content">
                <p>{review.review || 'No review text provided.'}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MovieReviews;