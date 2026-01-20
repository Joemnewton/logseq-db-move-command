# Logseq DB Move Command Plugin

A Logseq DB plugin that allows you to quickly move blocks to other pages or journal dates using slash commands.

## Features

- **Move To**: Search for and move blocks to any existing page or create a new one
- **Move To Date**: Move blocks to a specific journal date using a date picker
- **Move to Today**: Quickly move blocks to today's journal page
- **Move to Tomorrow**: Quickly move blocks to tomorrow's journal page

## Installation

### Easy Install (Recommended)

**Option 1: Direct Download (No build required)**
1. Download or clone this repository
2. In Logseq, go to Settings > Plugins > Load unpacked plugin
3. Select the repository folder

The `dist` folder with built files is already included, so you can use the plugin immediately without running any build commands.

**Option 2: From Releases**
1. Download the latest release ZIP from the [Releases page](https://github.com/Joemnewton/logseq-db-move-command/releases)
2. Extract the ZIP file
3. In Logseq, go to Settings > Plugins > Load unpacked plugin
4. Select the extracted folder

### For Developers

If you want to modify the plugin:

1. Clone this repository
2. Run `npm install` to install dependencies
3. Make your changes in `src/index.ts`
4. Run `npm run build` to rebuild
5. In Logseq, go to Settings > Plugins > Load unpacked plugin
6. Select the repository folder

### From Marketplace (Coming Soon)

Search for "Move Command" in the Logseq marketplace.

## Usage

1. Click on any block or place your cursor in a block
2. Type `/` to open the slash command menu
3. Choose one of the following commands:
   - **Move To**: Opens a search dialog to find or create a target page
   - **Move To Date**: Opens a date picker to select a journal date
   - **Move to Today**: Instantly moves the block to today's journal page
   - **Move to Tomorrow**: Instantly moves the block to tomorrow's journal page

### Move To

When you select "Move To", a dialog will appear with:
- A search box to find existing pages
- Real-time search results as you type
- Option to create a new page by typing its name
- Journal pages are marked with a 📅 icon

### Move To Date

When you select "Move To Date", a dialog will appear with:
- A date picker to select any date
- Defaults to today's date
- Creates a journal page for the selected date if it doesn't exist

## How It Works

The plugin moves the entire block (including its children) to the target page or journal date. The block will be appended to the end of the target page.

## Development

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Building

```bash
npm install
npm run build
```

### Development Mode

```bash
npm run dev
```

This will watch for changes and rebuild automatically.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Support

If you encounter any issues or have feature requests, please open an issue on the GitHub repository.
