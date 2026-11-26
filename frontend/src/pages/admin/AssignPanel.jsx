
import { useEffect, useState } from 'react';
import api from '../../api/axios';

function AssignPanel({ complaint })
{
    const [staff, setStaff] = useState([]);
    const [selectedStaffId, setSelectedStaffId] = useState('');
    const [loading, setLoading] = useState(true);
    const [assigning, setAssigning] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const complaintId = complaint.id || complaint._id;

    const [assignedStaffName, setAssignedStaffName] = useState(
        typeof complaint.assignedStaff === 'object'
            ? complaint.assignedStaff?.fullName || ''
            : complaint.assignedStaff || ''
    );

    useEffect(() =>
    {
        const fetchStaff = async () =>
        {
            try
            {
                setLoading(true);
                const response = await api.get('/api/admin/staff');
                setStaff(response.data.data || []);
            }
            catch(error)
            {
                setError(
                    error.response?.data?.message ||
                    'Unable to load staff members.'
                );
            }
            finally
            {
                setLoading(false);
            }
        };

        fetchStaff();
    }, []);

    const handleAssign = async () =>
    {
        if(!selectedStaffId)
        {
            setError('Please select a staff member.');
            return;
        }

        try
        {
            setAssigning(true);
            setError('');
            setMessage('');

            const response = await api.patch(
                `/api/admin/complaints/${complaintId}/assign`,
                {
                    staffId: selectedStaffId
                }
            );

            const selectedStaff = staff.find(
                member => member._id === selectedStaffId
            );

            setAssignedStaffName(
                selectedStaff?.fullName || 'Selected staff member'
            );

            setMessage(response.data.message || 'Complaint assigned successfully.');
            setSelectedStaffId('');
        }
        catch(error)
        {
            setError(
                error.response?.data?.message ||
                'Failed to assign complaint.'
            );
        }
        finally
        {
            setAssigning(false);
        }
    };

    const isResolved = complaint.status === 'Resolved';
    const isAssigned = Boolean(assignedStaffName);

    return (
        <section className="card assign-card" aria-labelledby="assign-heading">
            <h2 id="assign-heading">Assignment</h2>

            {isResolved ? (
                <p className="muted-note">
                    This complaint is resolved and cannot currently be reassigned.
                </p>
            ) : (
                <>
                    <p className="muted-note">
                        {isAssigned
                            ? `Currently assigned to ${assignedStaffName}.`
                            : 'This complaint has not been assigned to a staff member yet.'}
                    </p>

                    {loading ? (
                        <p className="muted-note">Loading staff members...</p>
                    ) : error && staff.length === 0 ? (
                        <div className="alert alert-error" role="alert">
                            {error}
                        </div>
                    ) : staff.length === 0 ? (
                        <p className="muted-note">
                            No staff members are available.
                        </p>
                    ) : (
                        <>
                            <label htmlFor="staff-select">
                                Select staff member
                            </label>

                            <select
                                id="staff-select"
                                value={selectedStaffId}
                                onChange={event =>
                                    setSelectedStaffId(event.target.value)
                                }
                            >
                                <option value="">Choose a staff member</option>

                                {staff.map(member => (
                                    <option
                                        key={member._id}
                                        value={member._id}
                                    >
                                        {member.fullName} - {member.handlingDepartment}
                                    </option>
                                ))}
                            </select>

                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={handleAssign}
                                disabled={assigning || !selectedStaffId}
                            >
                                {assigning
                                    ? 'Assigning...'
                                    : isAssigned
                                        ? 'Reassign Complaint'
                                        : 'Assign Complaint'}
                            </button>
                        </>
                    )}

                    {error && staff.length > 0 && (
                        <div className="alert alert-error" role="alert">
                            {error}
                        </div>
                    )}

                    {message && (
                        <div className="alert alert-info" role="status">
                            {message}
                        </div>
                    )}
                </>
            )}
        </section>
    );
}

export default AssignPanel;
