import axios from "axios";

// Get all movies
export const getAllMovies = async () => {
    try {
        const res = await axios.get("/movie");
        if (res.status !== 200) {
            throw new Error("No Data");
        }
        return res.data;
    } catch (err) {
        console.error("Error fetching movies:", err.response || err.message);
        throw err;
    }
};

// Send user authentication request
export const sendUserAuthRequest = async (data, signup) => {
    try {
        const res = await axios.post(`/user/${signup ? "signup" : "login"}`, {
            name: signup ? data.name : undefined, // Only include name for signup
            email: data.email,
            password: data.password,
        });
        if (res.status !== 200 && res.status !== 201) {
            throw new Error("Unexpected Error Occurred");
        }
        return res.data;
    } catch (err) {
        console.error("Error in user authentication:", err.response || err.message);
        throw new Error(err.response?.data?.message || "An error occurred during user authentication");
    }
};

// Send admin authentication request
export const sendAdminAuthRequest = async (data) => {
    try {
        const res = await axios.post("/admin/login", {
            email: data.email,
            password: data.password,
        });
        if (res.status !== 200) {
            throw new Error("Unexpected Error");
        }
        return res.data;
    } catch (err) {
        console.error("Error in admin authentication:", err.response || err.message);
        throw new Error(err.response?.data?.message || "An error occurred during admin authentication");
    }
};

export const getMovieDetails = async (id) => {
    const res = await axios.get(`/movie/${id}`).catch((err) => console.log(err));
    if(res.status !== 200){
        return console.log("Unexpected Error");
    }
    const resData = await res.data;
    return resData;
};

export const newBooking = async(data) => {
    const res = await axios
        .post("/booking", {
            movie: data.movie,
            seatNumber: data.seatNumber,
            date: data.date,
            user: localStorage.getItem("userId"),
        })
        .catch((err) => console.log(err));
    if(res.status !== 201){
        return console.log("Unexpected Error");
    }
    const resData = await res.data;
    return resData;
};

export const getUserBooking = async () => {
    const id = localStorage.getItem("userId");
    const res = await axios
        .get(`/user/bookings/${id}`)
        .catch((err) => console.log(err));
    
    if(res.status !== 200){
        return console.log("Unexpected Error");
    }
    const resData = await res.data;
    return resData;
};

export const deleteBooking = async(id) => {
    const res = await axios
        .delete(`/booking/${id}`)
        .catch((err) => console.log(err));
    if(res.status !== 200){
        return console.log("Unexpected Error");
    }

    const resData = await res.data;
    return resData;
};

export const getUserDetails = async () => {
    const id = localStorage.getItem("userId");
    const res = await axios.get(`/user/${id}`).catch((err) => console.log(err));
    if(res.status !== 200){
        return console.log("Unexpected Error");
    }
    const resData = await res.data;
    return resData;
};

export const addMovie = async (data) => {
    const res = await axios
    axios.post("/movie", {
        title: data.title,
        description: data.description,
        releaseDate: data.releaseDate,
        posterUrl: data.posterUrl,
        featured: data.featured,
        actors: data.actors,
        admin: localStorage.getItem("adminId"),
    }, 
    {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
    }
    )
    .catch(err => console.log(err));
    if(res.status !==201){
        return console.log("Unexpected Error Occured");
    }

    const resData = await res.data;
    return resData;
};

export const getAdminById = async () => {
    const adminId = localStorage.getItem("adminId");
    const res = await axios
        .get(`/admin/${adminId}`)
        .catch((err) => console.log(err));

    if(res.status !== 200){
        return console.log("Unexpected Error Occured");
    }
    const resData = await res.data;
    return resData;
};