import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { checkId } from '../../actions/auth';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
const UserType = ({ checkId }) => {
  const location = useLocation();
  const [idType, setIdType] = useState('');
  const [id, setId] = useState('');
  const navigate = useNavigate();
  const onSubmit = (e) => {
    e.preventDefault();
    if (idType && id && id !== '') {
      console.log('Inside onSubmit');
      checkId(id, location.state.id, navigate);
    }
  };
  const onIdTypeChange = (e) => {
    setIdType(e.target.value);
  };
  const onChange = (e) => {
    setId(e.target.value);
  };
  return (
    <section className="container">
      <form className="form" onSubmit={onSubmit}>
        <div className="form-group">
          <select name="id-type" value={idType} onChange={onIdTypeChange}>
            <option>* Select an id type</option>
            <option value="Employee ID">Employee ID</option>
            <option value="Registration Number">Registration Number</option>
          </select>
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Id"
            name="id"
            value={id}
            onChange={onChange}
          />
        </div>
        <input
          type="submit"
          className="btn btn-primary"
          value={`Verify my Id`}
        />
      </form>
    </section>
  );
};
UserType.propTypes = {
  checkId: PropTypes.func.isRequired
};
export default connect(null, { checkId })(UserType);
