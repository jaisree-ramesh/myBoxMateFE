import "./App.css";
import FooterNavigation from "./components/navigation/FooterNavigation";
import HeaderNavigation from "./components/navigation/HeaderNavigation";
import Home from "./pages/Home";

function App() {
  return (
    <>
      <div>
        <HeaderNavigation />
        <Home />
        <FooterNavigation />
      </div>
    </>
  );
}

export default App;
