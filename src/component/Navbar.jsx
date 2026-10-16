import { Badge, Box, Button, Flex, Heading, HStack, Link, Span } from "@chakra-ui/react"
import { ColorModeButton } from "@/components/ui/color-mode"
import { GrCart } from "react-icons/gr";
import { ImCart } from "react-icons/im";
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/clerk-react"
import Search from "./Search.jsx"


export default function Navbar ({ searchValue, onSearchChange, onSearchSubmit, onCartClick, cartItemCount }) {
    return (
        <Box as="nav" bg="bg" borderBottomWidth="1px" px="6" py="3" position="fixed" top="0" right="0" left="0" zIndex={1000}>
            <Flex align="center" justify="space-between" maxW="6xl" mx="auto">
                <Heading size="lg" whiteSpace="nowrap" display="flex" alignItems="center" gap="2">
                    <ImCart/>
                    <Span>
                        <Span fontWeight="extrabold">Stop</Span>
                            & 
                        <Span fontWeight="extrabold">Shop</Span>
                    </Span>
                </Heading>

                <Search value={searchValue} onChange={onSearchChange} onSubmit={onSearchSubmit}/>

                <HStack gap="6">
                    <Link href="/">Home</Link>
                    <Link href="../pages/Product.jsx">Product</Link>
                    <Button variant="ghost" size="sm" onClick={onCartClick} aria-label={`Open cart, ${cartItemCount} items`}>
                        <GrCart/>Cart
                        {cartItemCount > 0 && <Badge colorPalette="blue">{cartItemCount}</Badge>}
                    </Button>
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