import React from 'react';
import { ScrollView, SafeAreaView } from 'react-native';
import Header from '../components/Header';
import Services from '../components/Services';
import BestDeals from '../components/BestDeals';

// FrontPage Component: Displays main app sections
const FrontPage = () => {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={{ paddingBottom: 50, paddingTop: 10 }}> 
                {/* Displays the Header component */}
                <Header />
                {/* Displays the Services component */}
                <Services />
                {/* Displays the Best Deals section */}
                <BestDeals />
            </ScrollView>
        </SafeAreaView>
    );
};

export default FrontPage;
