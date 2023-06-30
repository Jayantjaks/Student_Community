import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addPost } from '../../actions/post';

const PostForm = ({ addPost }) => {
  const [text, setText] = useState('');
  const [file, setFile] = useState(null); // Stores the file user uploaded.
  const [fileAdded, setFileAdded] = useState(false);

  // Check the file added by the user and set it to file state.
  const onFileChange = (e) => {
    setFileAdded(true);
    // Supported formats that users can upload.
    const supportedFormats = ['png', 'pdf', 'jpg', 'jpeg'];

    //Check the file types and determine whether we allow this file and set according to it.
    const isFileSupported = supportedFormats.includes(
      e.target.files[0].type.split('/')[1]
    );
    const isFileSizeSupported = e.target.files[0].size <= 1024 * 1024;

    if (isFileSupported && isFileSizeSupported) {
      setFile(e.target.files[0]);
    }
    //Show error to the user.
    if (!isFileSupported) {
      console.log('We only support file uploads of pdf, png, jpg, jpeg');
    }
    if (isFileSupported && !isFileSizeSupported) {
      console.log('This file is too large.');
    }
  };
  return (
    <div className="post-form">
      <div className="bg-primary p">
        <h3>Say Something...</h3>
      </div>
      <form
        encType="multipart/form-data"
        className="form my-1"
        onSubmit={(e) => {
          e.preventDefault();
          if (text && (!fileAdded || (fileAdded && file))) {
            const fileData = new FormData();
            if (file) fileData.append('file', file);
            fileData.append('text', text);
            addPost(fileData);
            setText('');
            setFile(null);
          }
        }}
      >
        <textarea
          name="text"
          cols="30"
          rows="5"
          placeholder="Create a post"
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        />
        <div className="upload-div">
          <input
            className="upload-button"
            type="file"
            name="file"
            onChange={onFileChange}
            accept="image/jpg, image/jpeg, application/pdf, image/png"
          />
          <p>** Only pdf, png, jpg and jpeg. Max: 1Mb</p>
        </div>
        <input type="submit" className="btn btn-dark my-1" value="Submit" />
      </form>
    </div>
  );
};

PostForm.propTypes = {
  addPost: PropTypes.func.isRequired
};

export default connect(null, { addPost })(PostForm);
