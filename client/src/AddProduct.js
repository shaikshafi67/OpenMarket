import React, { useState } from 'react';
import axios from 'axios';

function AddProduct({ sellerId, onProductAdded }) {
    const [product, setProduct] = useState({
        title: '',
        description: '',
        price: '',
        location: '',
        category: 'Others' // Default category
    });

    const [image, setImage] = useState(null);
    const [video, setVideo] = useState(null);

    const handleChange = (e) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('seller_id', sellerId);
        formData.append('title', product.title);
        formData.append('description', product.description);
        formData.append('price', product.price);
        formData.append('location', product.location);
        formData.append('category', product.category);
        
        if (image) formData.append('image', image);
        if (video) formData.append('video', video);

        try {
            const res = await axios.post('/api/products/add', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert(res.data.message);
            onProductAdded();
        } catch (err) {
            alert("Upload failed. Check your server connection.");
        }
    };

    return (
        <div style={containerStyle}>
            <h3 style={{ borderBottom: '2px solid #e67e22', paddingBottom: '10px' }}>Post New Ad</h3>
            <form onSubmit={handleSubmit}>
                <label style={labelStyle}>Product Title</label>
                <input type="text" name="title" placeholder="e.g. iPhone 13" onChange={handleChange} required style={inputStyle} />
                
                <div style={{ display: 'flex', gap: '10px' }}>
                    <div style={{ flex: 1 }}>
                        <label style={labelStyle}>Category</label>
                        <select name="category" onChange={handleChange} style={inputStyle}>
                            <option value="Others">Others</option>
                            <option value="Mobiles">Mobiles</option>
                            <option value="Electronics">Electronics</option>
                            <option value="Vehicles">Vehicles</option>
                            <option value="Furniture">Furniture</option>
                        </select>
                    </div>
                    <div style={{ flex: 1 }}>
                        <label style={labelStyle}>Price (₹)</label>
                        <input type="number" name="price" placeholder="Price" onChange={handleChange} required style={inputStyle} />
                    </div>
                </div>

                <label style={labelStyle}>Location</label>
                <input type="text" name="location" placeholder="e.g. Rajkot" onChange={handleChange} required style={inputStyle} />

                <label style={labelStyle}>Description</label>
                <textarea name="description" placeholder="Condition, age, etc." onChange={handleChange} required style={{ ...inputStyle, height: '80px' }} />

                <div style={uploadBox}>
                    <label>📸 Image:</label> <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} required />
                    <br/><br/>
                    <label>🎥 Video:</label> <input type="file" accept="video/*" onChange={(e) => setVideo(e.target.files[0])} />
                </div>

                <button type="submit" style={btnStyle}>Submit for Admin Review</button>
            </form>
        </div>
    );
}

const containerStyle = { padding: '30px', backgroundColor: '#fff', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' };
const labelStyle = { display: 'block', margin: '10px 0 5px', fontWeight: 'bold' };
const inputStyle = { width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd', boxSizing: 'border-box' };
const uploadBox = { padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '8px', marginTop: '15px', border: '1px dashed #ccc' };
const btnStyle = { width: '100%', padding: '12px', backgroundColor: '#e67e22', color: 'white', border: 'none', borderRadius: '5px', marginTop: '20px', cursor: 'pointer', fontWeight: 'bold' };

export default AddProduct;