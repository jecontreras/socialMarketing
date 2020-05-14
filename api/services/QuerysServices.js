module.exports = async(modelo, query)=>{
  let resultado = Object();
  let skip = query.page || 0;
  let limit = query.limit || 10;
  let result = Object();
  if (!query.where) {
  query = {
    where: query
  };
  }
  let count = query.where;
  if(!query.sort){
      query.sort= 'createdAt DESC';
  }
  console.log("***********", query)
  if(query.populate){
      if(query.skip) resultado = await modelo.find({where: query.where, sort: query.sort}).populate(query.populate).paginate(skip, limit)
      else resultado = await modelo.find({where: query.where, sort: query.sort}).populate(query.populate)
  }else resultado = await modelo.find({where: query.where, sort: query.sort}).paginate(skip, limit);
  
  result.data = resultado;
  resultado = await modelo.count(count);
  result.count = resultado;
  return result;
};