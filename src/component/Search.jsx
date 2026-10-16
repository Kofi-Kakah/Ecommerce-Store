import { Box, Input, Button, HStack } from "@chakra-ui/react"

export default function Search ({ value, onChange, onSubmit }) {
    return (
        <Box as="form" onSubmit={onSubmit} flex="1" maxW="lg" mx="6">
            <HStack gap="2">
                <Input aria-label="Search products" placeholder="Search Products..." size="sm" value={value} onChange={onChange}/>
                <Button type="submit" size="sm">Search</Button>
            </HStack>
        </Box>
    )
}