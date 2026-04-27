
import { setNavigator } from "./utils/navigation";

import { AppRoutes } from "./routes/AppRoutes";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function App() {

  const navigate = useNavigate();

  useEffect(() => {
    /* Register navigator globally */

    setNavigator(navigate);

  }, [navigate]);

  return <AppRoutes />;
}

export default App;