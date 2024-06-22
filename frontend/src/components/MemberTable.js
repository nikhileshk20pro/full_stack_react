import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faSave, faTimes, faPlus } from '@fortawesome/free-solid-svg-icons';
import './MemberTable.css';
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const MemberTable = () => {
  const [members, setMembers] = useState([]);
  const [editMember, setEditMember] = useState(null);
  const [newMember, setNewMember] = useState({ name: '', email: '', phone: '' });
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate()
  const { user } = useSelector(state => state.auth)

  useEffect(() => {
    if (!user) navigate('/login')
  }, [user, navigate])

  useEffect(() => {
    axios.get('http://localhost:5000/members')
      .then(response => setMembers(response.data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditMember({ ...editMember, [name]: value });
  };

  const handleNewMemberChange = (e) => {
    const { name, value } = e.target;
    setNewMember({ ...newMember, [name]: value });
  };

  const handleEdit = (member) => {
    setEditMember(member);
    setErrorMessage('');
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:5000/members/${id}`)
      .then(() => setMembers(members.filter((member) => member._id !== id)))
      .catch(error => console.error('Error deleting member:', error));
  };

  const handleUpdate = () => {
    if (!editMember.name || !editMember.email || !editMember.phone) {
      setErrorMessage('All fields are required.');
      return;
    }
    axios.put(`http://localhost:5000/members/${editMember._id}`, editMember)
      .then(response => {
        setMembers(members.map((member) => (member._id === editMember._id ? response.data : member)));
        setEditMember(null);
        setErrorMessage('');
      })
      .catch(error => console.error('Error updating member:', error));
  };

  const handleAdd = () => {
    if (!newMember.name || !newMember.email || !newMember.phone) {
      setErrorMessage('All fields are required.');
      return;
    }
    axios.post('http://localhost:5000/members', newMember)
      .then(response => {
        setMembers([...members, response.data]);
        setNewMember({ name: '', email: '', phone: '' });
        setErrorMessage('');
      })
      .catch(error => console.error('Error adding member:', error));
  };

  return (
    <div className="container">
      <div className="header">
        <h2>Member List</h2>
        <button onClick={() => setNewMember({ name: '', email: '', phone: '' })}>
          <FontAwesomeIcon icon={faPlus} /> Add Member
        </button>
      </div>
      {errorMessage && <p className="error">{errorMessage}</p>}
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member) => (
            <tr key={member._id}>
              <td>
                {editMember && editMember._id === member._id ? (
                  <input className="form-input" name="name" value={editMember.name} onChange={handleEditChange} />
                ) : (
                  member.name
                )}
              </td>
              <td>
                {editMember && editMember._id === member._id ? (
                  <input className="form-input" name="email" value={editMember.email} onChange={handleEditChange} />
                ) : (
                  member.email
                )}
              </td>
              <td>
                {editMember && editMember._id === member._id ? (
                  <input className="form-input" name="phone" value={editMember.phone} onChange={handleEditChange} />
                ) : (
                  member.phone
                )}
              </td>
              <td className="actions">
                {editMember && editMember._id === member._id ? (
                  <>
                    <button onClick={handleUpdate}>
                      <FontAwesomeIcon icon={faSave} /> Update
                    </button>
                    <button onClick={() => setEditMember(null)}>
                      <FontAwesomeIcon icon={faTimes} /> Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEdit(member)}>
                      <FontAwesomeIcon icon={faEdit} /> Edit
                    </button>
                    <button onClick={() => handleDelete(member._id)}>
                      <FontAwesomeIcon icon={faTrash} /> Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
          {newMember && (
            <tr>
              <td>
                <input className="form-input" name="name" value={newMember.name} onChange={handleNewMemberChange} />
              </td>
              <td>
                <input className="form-input" name="email" value={newMember.email} onChange={handleNewMemberChange} />
              </td>
              <td>
                <input className="form-input" name="phone" value={newMember.phone} onChange={handleNewMemberChange} />
              </td>
              <td className="actions">
                <button onClick={handleAdd}>
                  <FontAwesomeIcon icon={faSave} /> Add
                </button>
                <button onClick={() => setNewMember(null)}>
                  <FontAwesomeIcon icon={faTimes} /> Cancel
                </button>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MemberTable;
