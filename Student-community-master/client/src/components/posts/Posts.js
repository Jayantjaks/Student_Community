import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import PostItem from './PostItem';
import PostForm from './PostForm';
import { getPosts } from '../../actions/post';

const Posts = ({ getPosts, post: { posts } }) => {
  const [postType, setPostType] = useState('All Posts');
  useEffect(() => {
    getPosts(postType.toLowerCase());
  }, [getPosts, postType]);
  const onPostTypeChange = (e) => {
    setPostType(e.target.value);
  };
  return (
    <section className="landing-2">
    <section className="container">
      <h1 className="large text-primary">Posts</h1>
      <p className="lead">
        <i className="fas fa-user" /> Welcome to the community
      </p>
      <PostForm />
      <div className="posts">
        <form className="form select-form-small">
          <div className="form-group">
            <select name="id-type" value={postType} onChange={onPostTypeChange}>
              <option value="All Posts">All Posts</option>
              <option value="My Posts">My Posts</option>
            </select>
          </div>
        </form>
        {posts?.map((post) => (
          <PostItem key={post._id} post={post} />
        ))}
      </div>
    </section>
    </section>
  );
};

Posts.propTypes = {
  getPosts: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  post: state.post
});

export default connect(mapStateToProps, { getPosts })(Posts);
