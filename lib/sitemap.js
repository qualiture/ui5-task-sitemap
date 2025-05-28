// lib/tasks/generate-sitemap.js
const fs = require('fs');
const path = require('path');

/**
 * Custom UI5 task to generate sitemap.xml
 */
module.exports = async function({workspace, dependencies, options, taskUtil}) {
    const {baseUrl, priority = 0.5, changefreq = 'weekly'} = options.configuration;
    
    // Read manifest.json to extract routes
    const manifestResource = await workspace.byPath('/manifest.json');
    const manifestContent = await manifestResource.getString();
    const manifest = JSON.parse(manifestContent);
    
    // Extract routing configuration
    const routing = manifest['sap.ui5']?.routing;
    if (!routing || !routing.routes) {
        taskUtil.getLogger().info('No routing configuration found in manifest.json');
        return;
    }
    
    // Generate sitemap URLs from routes
    const urls = [];
    
    // Add root URL
    urls.push({
        loc: baseUrl,
        priority: priority,
        changefreq: changefreq,
        lastmod: new Date().toISOString().split('T')[0]
    });
    
    // Add URLs for each route
    routing.routes.forEach(route => {
        if (route.pattern && route.pattern !== '') {
            // Convert UI5 route patterns to actual URLs
            let urlPath = route.pattern;
            
            // Handle route parameters (convert {param} to example values)
            urlPath = urlPath.replace(/\{[^}]+\}/g, 'example');
            
            // Remove leading slash if present
            urlPath = urlPath.replace(/^\//, '');
            
            const fullUrl = `${baseUrl}/#/${urlPath}`;
            
            urls.push({
                loc: fullUrl,
                priority: priority,
                changefreq: changefreq,
                lastmod: new Date().toISOString().split('T')[0]
            });
        }
    });
    
    // Generate XML sitemap
    const sitemap = generateSitemapXML(urls);
    
    // Create sitemap.xml resource
    const sitemapResource = await workspace.createResource({
        path: '/sitemap.xml',
        string: sitemap
    });
    
    taskUtil.getLogger().info(`Generated sitemap with ${urls.length} URLs`);
};

function generateSitemapXML(urls) {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    urls.forEach(url => {
        xml += '  <url>\n';
        xml += `    <loc>${escapeXML(url.loc)}</loc>\n`;
        xml += `    <lastmod>${url.lastmod}</lastmod>\n`;
        xml += `    <changefreq>${url.changefreq}</changefreq>\n`;
        xml += `    <priority>${url.priority}</priority>\n`;
        xml += '  </url>\n';
    });
    
    xml += '</urlset>';
    return xml;
}

function escapeXML(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}
