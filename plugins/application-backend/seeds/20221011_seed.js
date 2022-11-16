  exports.seed = async function(knex) {
    // Deletes ALL existing entries
    return await knex('application').truncate()
      .then(function () {
        console.log('teste seed QUALQUE OASKCpOAKSMFPOINMAEFpoINSEGFUNWGEPoiasnf')
        // Inserts seed entries
        return knex('application').insert([
          {
            id: "ad94b906-4970-11ed-b878-0242ac120001",
            creator:"teste1@email.com",
            name: 'application 1',
            serviceName: ['dorwssap'],
            description: "application 1",
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: "bbc3936c-4970-11ed-b878-0242ac120002",
            creator:"teste2@email.com",
            name: 'application 2',
            serviceName: ['dorwssap'],
            description: "application 1",
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: "c59dcd58-4970-11ed-b878-0242ac120003",
            creator:"nigel2@email.com",
            name: 'application 3',
            serviceName: ['dorwssap'],
            description: "application 1",
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: "c59dcd58-4970-11ed-b878-0242ac120004",
            creator:"teste4@email.com",
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