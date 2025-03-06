import { useEffect, useState } from "react";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
 

export default function UploadProject() {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // تعريف Schema التحقق من الإدخال
    const validationSchema = Yup.object({
        title: Yup.string().required("Title is required"),
        description: Yup.string().required("Description is required"),
        link: Yup.string().required("Link is required"),
    });

    // استخدام formik لمعالجة الإدخال
    const formik = useFormik({
        initialValues: {
            title: "",
            description: "",
            link: "",
        },
        validationSchema,
        onSubmit: async (values) => {
            setUploading(true);
            setError(null);
            setSuccess(null);

            try {
                const formData = new FormData();
                formData.append("image", file);
                formData.append("title", values.title);
                formData.append("description", values.description);
                formData.append("link", values.link);
                const token = localStorage.getItem("token");
                await axios.post(
                    'http://localhost:5000/api/upload-project',
                    formData,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`, // استبدل userToken بالتوكن الصحيح
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                );
                setUploading(false);
                setSuccess("Project uploaded successfully!");
                formik.resetForm();
                console.log("Project uploaded successfully!");
                setFile(null);
            } catch (err) {
                setUploading(false);
                setError(err?.response?.data?.message || "Something went wrong");
            }
        },
    });

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get("http://localhost:5000/api/get-projects", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                console.log(res.data);
            } catch (err) {
                console.error(err);
            }
        }
        fetchProjects();
    }, [])

    return (
      <div className="upload-container-upload-project">
    <div className="background-overlay"></div>

    <h2 className="upload-header-upload-project">Upload Project</h2>

    <form onSubmit={formik.handleSubmit} className="form-container-upload-project">
        {/* Title Field */}
        <div className="input-container">
            <div className="input-wrapper-title-upload">
                <input
                    type="text"
                    name="title"
                    placeholder="Project Title"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.title}
                    className={formik.touched.title && formik.errors.title ? 'input-error' : 'input'}
                />
                <i className="fas fa-heading icon"></i>
            </div>
            {formik.touched.title && formik.errors.title && (
                <p className="error-message">{formik.errors.title}</p>
            )}
        </div>

        {/* Description Field */}
        <div className="input-container">
            <div className="input-wrapper-description-upload">
                <textarea
                    name="description"
                    placeholder="Project Description"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.description}
                    className={formik.touched.description && formik.errors.description ? 'input-error' : 'input'}
                />
                <i className="fas fa-align-left icon"></i>
            </div>
            {formik.touched.description && formik.errors.description && (
                <p className="error-message">{formik.errors.description}</p>
            )}
        </div>

        {/* Link Field */}
        <div className="input-container">
            <div className="input-wrapper">
                <input
                    type="text"
                    name="link"
                    placeholder="Project Link"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.link}
                    className={formik.touched.link && formik.errors.link ? 'input-error' : 'input'}
                />
                <i className="fas fa-link icon"></i>
            </div>
            {formik.touched.link && formik.errors.link && (
                <p className="error-message">{formik.errors.link}</p>
            )}
        </div>

        {/* File Upload */}
        <div className="file-upload">
            <label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="file-input"
                />
                <i className="fas fa-cloud-upload-alt upload-icon"></i>
                <span className="file-name">{file ? file.name : 'Drag & Drop or Click to Upload'}</span>
            </label>
        </div>

        {/* Status Messages */}
        <div className="status-message">
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}
        </div>

        {/* Submit Button */}
        <button
            type="submit"
            disabled={uploading || !file}
            className={uploading ? 'button-disabled' : 'button-submit'}
        >
            {uploading ? (
                <>
                    <i className="fas fa-spinner fa-spin"></i>
                    Uploading...
                </>
            ) : (
                <>
                    <i className="fas fa-upload"></i>
                    Upload Project
                </>
            )}
        </button>
    </form>
</div>
    )
}
