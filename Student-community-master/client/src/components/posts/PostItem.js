import React, { Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import formatDate from '../../utils/formatDate';
import { connect } from 'react-redux';
import { addLike, removeLike, deletePost } from '../../actions/post';
import axios from 'axios';

const PostItem = ({
  addLike,
  removeLike,
  deletePost,
  auth,
  post: { _id, text, name, user, likes, comments, date, file },
  showActions
}) => {
  const [fileType, setFileType] = useState(null);
  const imageTypes = ['png', 'jpg', 'jpeg'];
  useEffect(() => {
    if (file) setFileType(file.split('.')[1]);
  }, [file]);
  return (
    <div className="post bg-white p-1 my-1">
      <div>
        <Link to={`/profile/${user._id}`}> 
          <img className="round-img" src={user.avatar} alt="" />
          <h4>{name}</h4>
        </Link>
      </div>
      <div>
        {imageTypes.includes(fileType) && (
          <img className="post-img" src={file} alt="Related to the post" />
        )}
        {fileType === 'pdf' && (
          <p
            className="pdf-link"
            onClick={() => {
              axios(file, {
                method: 'GET',
                responseType: 'blob'
              })
                .then((response) => {
                  //Create a Blob from the PDF Stream
                  const file = new Blob([response.data], {
                    type: 'application/pdf'
                  });
                  const fileURL = URL.createObjectURL(file);
                  window.open(fileURL);
                })
                .catch((error) => {
                  console.log(error);
                });
            }}
          >
            Open File
          </p>
        )}
        <p className="my-1">{text}</p>
        <p className="post-date">Posted on {formatDate(date)}</p>

        {showActions && (
          <Fragment>
            <button
              onClick={() => addLike(_id)}
              type="button"
              className="btn btn-light"
            >
              <i className="fas fa-thumbs-up" />{' '}
              <span>{likes.length > 0 && <span>{likes.length}</span>}</span>
            </button>
            <button
              onClick={() => removeLike(_id)}
              type="button"
              className="btn btn-light"
            >
              <i className="fas fa-thumbs-down" />
            </button>
            <Link to={`/posts/${_id}`} className="btn btn-primary">
              Discussion{' '}
              {comments.length > 0 && (
                <span className="comment-count">{comments.length}</span>
              )}
            </Link>
            {!auth.loading && user._id === auth.user._id && (
              <button
                onClick={() => deletePost(_id)}
                type="button"
                className="btn btn-danger"
              >
                <i className="fas fa-times" />
              </button>
            )}
          </Fragment>
        )}
      </div>
    </div>
  );
};

PostItem.defaultProps = {
  showActions: true
};

PostItem.propTypes = {
  post: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  addLike: PropTypes.func.isRequired,
  removeLike: PropTypes.func.isRequired,
  deletePost: PropTypes.func.isRequired,
  showActions: PropTypes.bool
};

const mapStateToProps = (state) => ({
  auth: state.auth
});

export default connect(mapStateToProps, { addLike, removeLike, deletePost })(
  PostItem
);
//3. Add all posts and your posts drop down in posts section
