import "./App.css";
import FooterNavigation from "./components/navigation/FooterNavigation";
import HeaderNavigation from "./components/navigation/HeaderNavigation";
import Home from "./pages/Home";
import Organize from "./pages/Organize";


function App() {
  return (
    <>
      <div>
        <HeaderNavigation />
        <Home />
        <Organize />
        
        <FooterNavigation />
      </div>
    </>
  );
}

export default App;
