const CellNft = require("../models/CellNftSchema");
const Nftcreate = require("../models/NftSchema");
const cron= require("node-cron");

const handleCellNft = async (req, res) => {
  try {
    const { startingPrice, endingPrice, duration, endTime, decrementDuration,nftId } = req.body;

    

    cron.schedule("*/1 * * * ", async () => {
      try {
        // Update starting price in the database
        const updatedNft = await Nftcreate.findOneAndUpdate(
          { _id: nftId },
          { $inc: { startingPrice: -0.0002 } },
          { new: true }
        );

        if (!updatedNft) {
          // Handle if Nftcreate document is not found
          console.error("NFT document not found.");
          return;
        }

        // Emit the updated price through WebSocket (if WebSocket is implemented)

        // You can also fetch the updated startingPrice from updatedNft and send it through WebSocket
        const updatedStartingPrice = updatedNft.startingPrice;

        // Uncomment the next line if you have WebSocket implemented
        // io.emit("priceUpdate", updatedStartingPrice);

        console.log(`Starting Price Updated: ${updatedStartingPrice}`);
      } catch (error) {
        console.error(`Error updating starting price: ${error.message}`);
      }
    });

    const newCellNft = new CellNft({
      startingPrice,
      endingPrice,
      duration,
      endTime,
      decrementDuration,
      nftId,
    });


    const reqData = req.body; // _id
    let showData = {};
    const nftData = await Nftcreate.findOne({ _id: reqData.id }, {});

    if (nftData) {
      showData['uploadfile'] = nftData.uploadfile;
      showData['nftName'] = nftData.nftName;
    }

    // Save newCellNft before sending the response
    await newCellNft.save();

    res.status(200).json({
      success: true,
      data: showData,
      message: 'Successfully get!!',
    });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Err-: ' + error.message });
  }
};

module.exports = { handleCellNft };
