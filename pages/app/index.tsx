import { Layout } from "../../components/Layout";

const App = () => <Layout>This app index is protected.</Layout>;

App.requireAuth = true;

export default App;
