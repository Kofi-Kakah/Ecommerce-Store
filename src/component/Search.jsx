import { Input, Button, HStack } from "@chakra-ui/react"

export default function Search () {
    return (
        <HStack flex="1" maxW="lg" mx="6" gap="2">
            <Input placeholder="Search Products..." size="sm"/> 
            <Button size="sm">Search</Button>
        </HStack>
    )
}