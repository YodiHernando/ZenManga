import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description }) => {
    return (
        <Helmet>
            <title>{title ? `${title} | ZenManga` : 'ZenManga | The Future of Manga'}</title>
            <meta name="description" content={description || "Discover your next favorite manga with ZenManga. Track your reading progress, browse trending titles, and enjoy a futuristic reading experience."} />
        </Helmet>
    );
};

export default SEO;
