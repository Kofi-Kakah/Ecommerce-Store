import { Box, Input, Button, HStack } from "@chakra-ui/react"

export default function Search ({ value, onChange, onSubmit }) {
    return (
        <Box
            as="form"
            onSubmit={onSubmit}
            flex={{ base: "1 0 100%", md: "1 1 0" }}
            order={{ base: "3", md: "2" }}
            minW="0"
            maxW={{ base: "full", md: "lg" }}
            mx={{ base: "0", md: "6" }}
        >
            <HStack gap="2">
                <Input aria-label="Search products" placeholder="Search Products..." size="sm" value={value} onChange={onChange} minW="0"/>
                <Button type="submit" size="sm" flexShrink="0">Search</Button>
            </HStack>
        </Box>
    )
}