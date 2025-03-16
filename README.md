# FloodWatch

FloodWatch is a real-time flood monitoring application that provides up-to-date water level data from monitoring stations across the United Kingdom.

![FloodWatch Preview](/public/floodWatch.png)

## Overview

FloodWatch offers a user-friendly interface for tracking water levels at various monitoring stations, helping users stay informed about potential flooding risks. The application fetches data from the official UK Environment Agency's flood monitoring API and displays it in an intuitive, interactive format.

## Features

- **Real-time Data**: Access the latest water level readings from flood monitoring stations
- **Interactive Station Selection**: Choose from hundreds of monitoring stations across the UK
- **Visual Data Representation**: View water level data through interactive charts
- **Tabular View Option**: Switch between chart and table views for different data analysis needs
- **Responsive Design**: Access the application on desktop or mobile devices
- **24-Hour Historical Data**: See water level trends over the past 24 hours

## Technology Stack

- **Frontend**: React, Next.js 15
- **UI Components**: ShadCn UI, Tailwind CSS
- **Data Visualization**: Recharts
- **API Integration**: UK Environment Agency Flood Monitoring API
- **Typescript**: For type safety and code quality
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18.18.0 or higher
- npm, yarn, pnpm, or bun package manager

### Installation

1. Clone the repository:

```bash
git clone https://github.com/PDochev/flood-monitoring.git
cd flood-monitoring
```

2. Install dependencies:

```bash
npm install
# or
yarn
# or
pnpm install
# or
bun install
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## API Integration

FloodWatch integrates with the [UK Environment Agency's Flood Monitoring API](https://environment.data.gov.uk/flood-monitoring/doc/reference). The application fetches:

- A list of monitoring stations
- Real-time water level readings for each station
- Historical data for the past 24 hours

<!-- ## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request -->

## License

This project is licensed under the [MIT License](LICENSE).

## Acknowledgements

- [UK Environment Agency](https://environment.data.gov.uk/) for providing the flood monitoring data
- [Next.js](https://nextjs.org/) for the React framework
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Recharts](https://recharts.org/) for data visualization
- [ShadcnUI](https://ui.shadcn.com/) for the UI components

## Contact

Plamen Dochev - [LinkedIn](https://www.linkedin.com/in/plamendochev/) - [GitHub](https://github.com/PDochev)

Project Link: [https://github.com/PDochev/flood-monitoring](https://github.com/PDochev/flood-monitoring)

Deployed Site: [https://flood-watch-khaki.vercel.app/](https://flood-watch-khaki.vercel.app/)
