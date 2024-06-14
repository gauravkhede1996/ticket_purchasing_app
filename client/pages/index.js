import axios from "axios";
import BuildClient from "../api/build-client";
const Landing = ({ currentUser}) => {
  return currentUser? <h1>You are Signed In</h1> : <h1>You are NOT Signed In</h1>
  };

Landing.getInitialProps = async ({ req }) => {
  console.log('Landing Page');
  const client = BuildClient({ req });
  const { data } = await client.get('/api/users/currentuser');
  return data;
}
  export default Landing;