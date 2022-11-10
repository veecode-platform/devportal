  exports.seed = async function(knex) {
    // Deletes ALL existing entries
    return await knex('application').truncate()
      .then(function () {
        // Inserts seed entries
        return knex('application').insert([
          {
            id: "ad94b906-4970-11ed-b878-0242ac120002",
            creator:"nigel@email.com",
            name: 'application 1',
            serviceName: ['dorwssap'],
            description: "application 1",
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: "bbc3936c-4970-11ed-b878-0242ac120002",
            creator:"nigel2@email.com",
            name: 'application 2',
            serviceName: ['dorwssap'],
            description: "application 1",
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: "c59dcd58-4970-11ed-b878-0242ac120002",
            creator:"nigel3@email.com",
            name: 'application 3',
            serviceName: ['dorwssap'],
            description: "application 1",
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: "c59dcd58-4970-11ed-b878-0242ac120003",
            creator:"lima@email.com",
            name: 'application 4',
            serviceName: ['dorwssap'],
            description: "application 1",
            createdAt: new Date(),
            updatedAt: new Date(),
            consumerName: ['teste']
          }
        ]);
      });
  };