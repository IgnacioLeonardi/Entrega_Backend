import { productsManager } from "../dao/mongodb/mongodb.js";

export async function getProductController(req, res) {
  let limit = Number(req.query.limit);
  try {
    const data = await productsManager.find();
    if (!limit) {
      return res.json(data);
    }
    let limitedProducts = data.slice(0, limit);
    return res.json(limitedProducts);
  } catch (error) {
    res.send(404).send({ message: error.message });
  }
}

export async function getProductControllerId(req, res) {
  const id = req.params.id;
  try {
    const productForId = await productsManager.findById(id);
    return res.json({ productForId });
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
}

export async function postProductController(req, res) {
  try {
    await productsManager.create(req.body);
    res.json(req.body);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
}

export async function putProductController(req, res) {
  const { id } = req.params;
  try {
    await productsManager.updateOne({_id: id }, {$set: req.body});
    res.json(id);
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
}

export async function deleteProductController(req, res) {
  const { id } = req.params;
  try {
    await productsManager.deleteOne(id);
    res.json(req.body);
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
}
