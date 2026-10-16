import { Box, VStack, Text, Heading, Button, HStack, Separator } from "@chakra-ui/react"
import {FiArrowRight, FiTruck, FiShield, FiTag, FiHeadphones } from "react-icons/fi"
import "../Styles/Hero.css"

export default function Hero () {

        const features = [
            { icon: FiTruck, label: "Fast & Reliable Delivery" },
            { icon: FiShield, label: "Secure Payments" },
            { icon: FiTag, label: "Great Deals" },
            { icon: FiHeadphones, label: "Dedicated Support" },
        ];

    return (
        <Box className="body" display="flex" alignItems="start" px={{ base: "4", md: "20" }} mt={{ base: "48", sm: "44", md: "20" }} py={{ base: "4", md: "0" }}>
            <VStack align="start" gap="4" maxW="lg">
            <Text fontSize="sm" letterSpacing="widest" fontWeight="medium" color="gray.700" mt={{ base: "6", md: "10" }}>
                    YOUR FAVOURITE STORE, ALL IN ONE PLACE
                </Text>

                <Heading fontSize={{ base: "4xl", sm: "5xl", md: "8xl" }} fontWeight="extrabold" lineHeight="1.05" color="gray.900">
                    Stop and Shop
                </Heading>

                <Text color="gray.700">
                    Quality products. Great prices. Everything you need, just a click away.
                </Text>

                <Button size="lg" bg="gray.900" color="white">
                    Shop Now  <FiArrowRight/>
                </Button>

                <HStack
                    gap={{ base: "3", md: "6" }}
                    mt="6"
                    align="stretch"
                    display={{ base: "grid", md: "flex" }}
                    gridTemplateColumns={{ base: "repeat(2, minmax(0, 1fr))", md: "none" }}
                    width={{ base: "full", md: "auto" }}
                >
                    {features.map((f, i) => (
                        <HStack key={f.label} gap={{ base: "0", md: "6" }} justify={{ base: "center", md: "flex-start" }}>
                            <VStack gap="1" w={{ base: "full", md: "24" }} textAlign="center">
                                <f.icon size={26}/>
                                <Text fontSize="xs" color="gray.700">{f.label}</Text>
                            </VStack>
                            {i < features.length - 1 && <Separator display={{ base: "none", md: "block" }} orientation="vertical" height="10"/>}
                        </HStack>
                    ))}
                </HStack>
            </VStack>
        </Box>
    )
}