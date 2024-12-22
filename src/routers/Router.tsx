import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import BrokerSummary from "../components/BrokerSummary";
import MarketSummary from "../components/MarketSummary";
import SectorSummary from "../components/SectorSummary";
import SymbolAndName from "../components/SymbolAndName";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    // errorElement: <Error/>,
    children: [
      {
        path: "/",
        element: <BrokerSummary />,
      },
      {
        path: "/broker",
        element: <BrokerSummary />,
      },
      {
        path: "/market",
        element: <MarketSummary />,
      },
      {
        path: "/sector",
        element: <SectorSummary />,
      },
      {
        path: "/symbol",
        element: <SymbolAndName/>,
      },
    ],
  },
]);

export default router;