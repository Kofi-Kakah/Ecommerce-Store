import "./App.css"
import { Heading } from "@chakra-ui/react"
import Navbar from "./component/Navbar.jsx"


export default function App () {
    return (
          <div>
            <Navbar/>
            <Heading size="4xl">Hello World</Heading>
          </div>

    )
}