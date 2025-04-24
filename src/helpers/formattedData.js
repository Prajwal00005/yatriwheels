const formattedData = data => {
  console.log(data)
  return {
    id: data.id,
    name: data.name,
    email: data.email,
    phone: data.phone,
    address: data.address,
    roles: data.roles,
    avatar: data?.avatar,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt
  }
}
module.exports = { formattedData }
