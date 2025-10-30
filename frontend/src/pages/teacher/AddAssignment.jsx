import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddAssignment = () => {
  const [assignments, setAssignments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newAssignment, setNewAssignment] = useState({
    assessmentID: '',
    assessmentName: '',
    assessmentDate: '',
    assessmentLastDate: '',
    assessmentContent: '',
    auraCoins: 0,
    ratingPoint: 0,
    file: null,
    subject: '', // Added subject
  });
  const [subjects, setSubjects] = useState([]); // State for storing subjects

  const [teacherId, setTeacherId] = useState("");
  const [selectedSubject, setSelectedSubject] = useState(""); // Added state for the selected subject
  const [assFile, setAssFile] = useState("");

  useEffect(() => {
    const fetchTeacherProfile = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/user/teacher/profile`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Add token for auth if required
          },
        });
        setTeacherId(response.data._id);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTeacherProfile();
  }, []);

  const postcloudinary = (myfile) => {
    // Check if the file is undefined or null
    if (!myfile) {
      console.error("Assignment file is not defined");
      return;
    }



    // Prepare the FormData for Cloudinary upload
    const data = new FormData();
    data.append("file", myfile);
    data.append("upload_preset", "AuraTracker");
    data.append("cloud_name", "dqx48ke30");

    // Upload to Cloudinary
    fetch("https://api.cloudinary.com/v1_1/dqx48ke30/image/upload", {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        // Check if Cloudinary returned a valid URL
        if (data.secure_url) {
          setAssFile(data.secure_url);
          handleFile(data.secure_url);
          console.log(data.secure_url);
          console.log("Image uploaded successfully:", data.secure_url);
        } else {
          console.error(
            "Failed to upload file to Cloudinary:",
            data.error.message
          );
        }
      })
      .catch((err) => {
        console.error("An error occurred while uploading the file:", err);
      });
  };

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        if (teacherId) {
          const response = await axios.get(`${import.meta.env.VITE_API_URL}/teacher/getSubjects/${teacherId}`);
          setSubjects(response.data);
        }
      } catch (error) {
        console.error('Error fetching subjects:', error);
      }
    };
    fetchSubjects();
  }, [teacherId]);

  // Handler to show/hide form
  const handleAddAssignmentClick = () => {
    setShowForm(!showForm);
  };

  // Handler to update input fields
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setNewAssignment((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };
  const handleFile = (child) => {
    setNewAssignment((prev) => ({
      ...prev,
      assessmentContent: child ? child : "",
    }));
    newAssignment
  };

  const addAssignmentToSubject = async (teacherId, subjectId, assignmentData) => {
    try {
      console.log(assignmentData)
      console.log('Adding assignment fucntion putting post request');
      const url =`${import.meta.env.VITE_API_URL}/teacher/${teacherId}/${subjectId}/addAssignment`;
      const response = await axios.post(url, assignmentData);
      console.log('Assignment added successfully:', response.data);
      alert('Assignment added successfully');
    } catch (error) {
      console.error('Error adding assignment:', error.response ? error.response.data : error.message);
      alert('Failed to add assignment');
    }
  };

  // Handler to add new assignment
  const handleSubmit = (e) => {
    e.preventDefault();
    // Add assignment to the local state
    setAssignments([...assignments, newAssignment]);

    // Reset the form data
    setNewAssignment({
      assessmentID: '',
      assessmentName: '',
      assessmentDate: '',
      assessmentLastDate: '',
      assessmentContent: '',
      auraCoins: 0,
      ratingPoint: 0,
      file: null,
      subject: '', // Reset subject
    });

    // Hide the form after submission
    setShowForm(false);

    // Call the function to add assignment to subject
    if (selectedSubject) {
      addAssignmentToSubject(teacherId, selectedSubject, newAssignment);
    }
  };

  // Update the selected subject when the user changes it
  const handleSubjectChange = (e) => {
    setSelectedSubject(e.target.value);
  };

  return (
    <div className="container  p-4 overflow-hidden bg-black bg-opacity-20 rounded">
      <h2 className="text-4xl text-white font-bold text-center mb-6">Assignments</h2>

      {/* Button to show/hide form */}
      <button
        onClick={handleAddAssignmentClick}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green -600"
      >
        {showForm ? "Cancel" : "Add New Assignment"}
      </button>

      {/* Form for new assignment */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mt-4 space-y-4 border p-4 rounded-lg shadow-md overflow-scroll"
        >
          <div>
            <label className="block text-white font-semibold">Assessment ID</label>
            <input
              type="text"
              name="assessmentID"
              value={newAssignment.assessmentID}
              onChange={handleChange}
              required
              className="w-full border text-white bg-transparent px-3 py-2 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-white font-semibold">Assessment Name</label>
            <input
              type="text"
              name="assessmentName"
              value={newAssignment.assessmentName}
              onChange={handleChange}
              required
              className="w-full border text-white bg-transparent px-3 py-2 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-white font-semibold">Assessment Date</label>
            <input
              type="date"
              name="assessmentDate"
              value={newAssignment.assessmentDate}
              onChange={handleChange}
              required
              className="w-full border text-white bg-transparent px-3 py-2 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-white font-semibold">Assessment Last Date</label>
            <input
              type="date"
              name="assessmentLastDate"
              value={newAssignment.assessmentLastDate}
              onChange={handleChange}
              required
              className="w-full border text-white bg-transparent px-3 py-2 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-white font-semibold">Upload File</label>
            <input
              type="file"

              onChange={(e) => postcloudinary(e.target.files[0])}
              required
              className="w-full text-white bg-transparent"
            />
          </div>

          <div>
            <label className="block text-white font-semibold">Aura Coins</label>
            <input
              type="number"
              name="auraCoins"
              value={newAssignment.auraCoins}
              onChange={handleChange}
              required
              className="w-full border text-white bg-transparent px-3 py-2 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-white font-semibold">Rating Point</label>
            <input
              type="number"
              name="ratingPoint"
              value={newAssignment.ratingPoint}
              onChange={handleChange}
              required
              className="w-full border text-white bg-transparent px-3 py-2 rounded-lg"
            />
          </div>

          {/* Subject Dropdown */}
          <div>
            <label className="block text-white font-semibold">Subject</label>
            <select
              name="subject"
              value={selectedSubject}
              onChange={handleSubjectChange}
              required
              className="w-full text-white bg-transparent border px-3 py-2 rounded-lg"
            >
              <option value="" className='text-white'>Select Subject</option>
              {subjects.length > 0 ? (
                subjects.map((subject) => (
                  <option key={subject._id} className='bg-black' value={subject._id}>
                    {subject.subjectName}
                  </option>
                ))
              ) : (
                <option disabled className='text-white'>No subjects available</option>
              )}
            </select>
          </div>

          {/* <div>
            <label className="block font-semibold">Upload File</label>
            <input
              type="file"
              name="file"
              onChange={handleChange}
              className="w-full"
            />
          </div> */}
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Assignment
          </button>
        </form>
      )}

      {/* List of assignments */}
      <div className="mt-8 ">
        {assignments.length > 0 ? (
          assignments.map((assignment, index) => (
            <div key={index} className="border p-4 rounded-lg shadow-md mb-4">
              <p>
                <strong>Assessment ID:</strong> {assignment.assessmentID}
              </p>
              <p>
                <strong>Assessment Name:</strong> {assignment.assessmentName}
              </p>
              <p>
                <strong>Assessment Date:</strong> {assignment.assessmentDate}
              </p>
              <p>
                <strong>Assessment Last Date:</strong>{" "}
                {assignment.assessmentLastDate}
              </p>
              <p>
                <strong>Content:</strong> {assignment.assessmentContent}
              </p>
              <p>
                <strong>Aura Coins:</strong> {assignment.auraCoins}
              </p>
              <p>
                <strong>Rating Point:</strong> {assignment.ratingPoint}
              </p>
              <p>
                <strong>Subject:</strong> {assignment.subject}
              </p>{" "}
              {/* Display selected subject */}
              {assignment.file && (
                <p>
                  <strong>File:</strong> {assignment.file.name}
                </p>
              )}
              <button className="bg-blue-700 p-3 rounded-md m-2 text-white">
                Check Submission
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No assignments added yet.</p>
        )}
      </div>
    </div>
  );
};

export default AddAssignment;
