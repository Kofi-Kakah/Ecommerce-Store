import { Box, Flex, Heading, HStack, Link } from "@chakra-ui/react"
import { ColorModeButton } from "@/components/ui/color-mode"
import { GrCart } from "react-icons/gr";


export default function Navbar () {
    return (
        <Box as="nav" bg="bg.subtle" borderBottomWidth="1px" px="6" py="3">
            <Flex align="center" justify="space-between" maxW="6xl" mx="auto">
                <Heading size="lg">Stop & Shop</Heading>

                <HStack gap="6">
                    <Link href="#">Home</Link>
                    <Link href="#">Product</Link>
                    <Link href="#"><GrCart/>Cart</Link>
                    <ColorModeButton/>
                </HStack>
            </Flex>
        </Box>
    )
}