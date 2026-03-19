import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import noImage from '../assets/noimage.jpg';

export default function MediaCard({ data, edit, deletes, publish }) {

  const navigate = useNavigate();
  const [display, setDisplay] = useState("");
  const content = data.content.slice(0, 50);
  const token = localStorage.getItem("x-token");

  useEffect(()=>{
    if(token){
      const decode = jwtDecode(token);
      if(!(decode.exp*1000>Date.now())){
         navigate('/auth');
      }
    }
  },[]);

  const handleRead = () => {
    navigate('/latestblogspage/post', { state: { postData: data } });
  }

  const handleEdit = () => {
    navigate('/editpage/editpost', { state: { postData: data } });
  }

  const handleDelete = async () => {
    try {
      if (!confirm(`Are you sure delete this post:${data._id}`)) return;
      const result = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/deletepost/${data._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (result.data.deleteResult.deleteCount == 1) {
        alert("successfully deleted");
        navigate('/latestBlogsPage');
        return;
      }
      else {
        alert("deletion failed");
        return;
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Deletion failed!");
    }
  };

  const handlePublish = async () => {
    try {
      if (!confirm(`Are you sure to publish this post:${data._id}`)) return;
      const result = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/publish/${data._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (result.status == 200) {
        alert("successfully published");
        navigate('/latestBlogsPage');
        return;
      }
      else {
        alert("publition failed");
        return;
      }
    } catch (err) {
      console.error(err);
      console.error(err.response?.data?.message
      )
      alert(err.response?.data?.message || "publition failed!");
    }
  };

  return (
    <Card sx={{ maxWidth: 410, width:{xs:'95vw'}, border: { xs: '2px solid black', sm: '3.5px solid black' }, borderRadius: 3, backgroundColor: '#f4f4f4' }}>
      <CardMedia
        sx={{ height: 240, m: 1, boxShadow: '2px 2px 2px 2px grey', borderRadius: 2 }}
        image={data.image || noImage }
        title={data.title}
      />
      <Divider sx={{ borderColor: 'black', borderBottomWidth: 3 }} />
      <CardContent>
        <Typography gutterBottom variant="h6" component="div" sx={{overflow:'hidden'}}>
          {data.title}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {content}
        </Typography>
        <Typography sx={{ color: 'success' }}>
          <span style={{ fontWeight: '500' }}>Author:</span> {data.penName}
        </Typography>
      </CardContent>
      <CardActions sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button size="medium" variant='contained' color='success' sx={{ textTransform: 'none', borderRadius: 2 }} onClick={handleRead}>Read</Button>
        {edit && <Button size="medium" color='primary' variant='contained' sx={{ textTransform: 'none', borderRadius: 2 }} onClick={handleEdit}>Edit</Button>}
        {deletes && <Button size="medium" color='error' variant='contained' sx={{ textTransform: 'none', borderRadius: 2 }} onClick={handleDelete}>Delete</Button>}
        {publish && <Button size="medium" color='error' variant='contained' sx={{ textTransform: 'none', borderRadius: 2 }} onClick={handlePublish}>Publish</Button>}
      </CardActions>
    </Card>
  );
}
