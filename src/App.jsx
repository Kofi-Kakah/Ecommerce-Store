import "./App.css"
import { Heading } from "@chakra-ui/react"
import Home from "./pages/Home";


export default function App () {
    return (
          <div>
            <Home/>
            <Heading size="4xl">Hello World</Heading>
          </div>

    )
}