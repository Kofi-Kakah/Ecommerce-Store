import { Box, Button, Flex, Heading, HStack, Link } from "@chakra-ui/react"
import { ColorModeButton } from "@/components/ui/color-mode"
import { GrCart } from "react-icons/gr";
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/clerk-react"
import Search from "./Search.jsx"


export default function Navbar () {
    return (
        <Box as="nav" bg="bg.subtle" borderBottomWidth="1px" px="6" py="3">
            <Flex align="center" justify="space-between" maxW="6xl" mx="auto">
                <Heading size="lg" whiteSpace="nowrap">Stop & Shop</Heading>

                <Search/>

                <HStack gap="6">
                    <Link href="#">Home</Link>
                    <Link href="#">Product</Link>
                    <Link href="#"><GrCart/>Cart</Link>
                    <SignedOut>
                        <SignInButton>
                            <Button variant="ghost" size="sm">Sign In</Button>
                        </SignInButton>
                        <SignUpButton mode="modal">
                            <Button size="sm">Sign Up</Button>
                        </SignUpButton>
                    </SignedOut>

                    <SignedIn>
                        <UserButton/>
                    </SignedIn>
                    <ColorModeButton/>
                </HStack>
            </Flex>
        </Box>
    )
}