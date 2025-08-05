import { useState, useEffect } from 'react';
import { authApi } from "@/lib/apiService";
import { ToastContainer, toast } from 'react-toastify';

const ModalFormUser = ({ isOpen, onClose, user, onSuccess }) => {
  const isEdit = !!user;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    status: 'active',
    role_id: ''
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        password: '',
        status: user.status || 'active',
        role_id: user.role_id || ''
      });
    } else {
      setFormData({
        name: '',
        email: '',
        password: '',
        status: 'active',
        role_id: ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let response;
      if (isEdit) {
        response = await authApi.updateUser(user.id, formData);
      } else {
        response = await authApi.createNewUser(formData);
      }
      console.log(response)
      toast.success(!isEdit ? "Sukses membuat data baru" : ("Sukses Merubah data " + response.data.data.user.email), { position: 'top-right' });
      // if (response.status !== 200 || response.status !== 201) return;

      onSuccess(); // callback to refresh list
      onClose();   // close modal
    } catch (error) {
      toast.error("Gagal membuat data baru " + error.message, { position: 'top-right' });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">{isEdit ? 'Edit User' : 'Create New User'}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Name"
            className="input input-bordered w-full"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="input input-bordered w-full"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {!isEdit && (
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="input input-bordered w-full"
              value={formData.password}
              onChange={handleChange}
              required
            />
          )}
          {/* <select
            name="role_id"
            className="select select-bordered w-full"
            value={formData.role_id}
            onChange={handleChange}
          >
            <option value={1}>Admin</option>
            <option value={2}>Operator</option>
            <option value={3}>Viewer</option>
          </select>
          */}
          <select
            name="status"
            className="select select-bordered w-full"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <div className="modal-action">
            <button type="button" className="btn" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : isEdit ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalFormUser;
